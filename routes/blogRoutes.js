const express = require('express');
const Property = require('../mongodb/models/property');
const Blog = require('../mongodb/models/blog');
const { blogImageUpload } = require('../middleware/fileUplaod');
const app = express.Router();
const fs = require('fs');
const webp = require('webp-converter');

app.get('/count', async (req, res) => {
  try {
    const count = await Blog.countDocuments({});
    // console.log(count)
    res.json({ count: count });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/', blogImageUpload('image'), async (req, res) => {
  try {
    const { title, blogText, keywords, writter, readTime, tag, topic, lang } =
      req.body;
    console.log(req.body);
    const imgBlob = await webp.cwebp(
      req.file.path,
      req.file.path.replace(req.file.filename.match(/.[a-zA-Z]+$/), '.webp'),
      '-q 80',
      (logging = '-v')
    );
    const blog = new Blog({
      title,
      image:
        imgBlob &&
        req.file.filename.replace(
          req.file.filename.match(/.[a-zA-Z]+$/),
          '.webp'
        ),
      blogText,
      keywords,
      writter,
      readTime,
      tag,
      topic,
      lang,
    });
    await blog.save();
    res.send({ message: 'Success' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/', async (req, res) => {
  let { page, limit } = req.query;
  try {
    let blogs = [];
    if (
      req.headers['accept-language'] === 'en' ||
      req.headers['accept-language'] === 'ar'
    ) {
      blogs = await Blog.find({ lang: req.headers['accept-language'] })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
    } else {
      blogs = await Blog.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
    }
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/count', async (req, res) => {
  try {
    const blogs = await Blog.count();
    res.json(blogs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/latest', async (req, res) => {
  try {
    const blogs = await Blog.find({ lang: req.headers['accept-language'] })
      .sort({ createdAt: -1 })
      .limit(3);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/update/:id', blogImageUpload('image'), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) {
      update.image = req.file.filename;
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (blog) {
      res.json({ message: 'Blog deleted successfully' });
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/title/:title', async (req, res) => {
  const { title } = req.params;
  const fullTitle = title.replaceAll('-', ' ').replaceAll('_qm_', '?');
  try {
    const blogs = await Blog.findOne({
      title: fullTitle,
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/:keywords', async (req, res) => {
  const { keywords } = req.params;
  try {
    const blogs = await Blog.find({
      lang: req.headers['accept-language'],
      keywords: { $regex: keywords, $options: 'i' },
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/topics/:topic', async (req, res) => {
  const { topic } = req.params;
  let { page, limit } = req.query;
  if (!limit) limit = 0;
  if (!page) page = 1;

  try {
    const blogs = await Blog.find({
      lang: req.headers['accept-language'],
      topic: {
        $regex: topic.replaceAll('-', ' ').replaceAll('_qm_', '?'),
        $options: 'i',
      },
    })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/tags/:tag', async (req, res) => {
  const { tag } = req.params;
  let { page, limit } = req.query;
  if (!limit) limit = 0;
  if (!page) page = 1;
  if (page == undefined) page = 1;
  try {
    const blogs = await Blog.find({
      tag: {
        $regex: tag.replaceAll('-', ' ').replaceAll('_qm_', '?'),
        $options: 'i',
      },
    })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/relatedPosts/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    const relatedBlogs = await Blog.find({
      _id: { $ne: blogId }, // Exclude the current post
      keywords: { $in: blog.keywords.split(',')[0] },
    }).limit(3); // Fetch a maximum of 3 related posts
    res.json(relatedBlogs);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/relatedProperties/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    const relatedProperties = await Property.find({
      $or: [
        { tags: { $regex: blog.tag, $options: 'i' } },
        { tagsAr: { $regex: blog.tag, $options: 'i' } },
      ],
    })
      .limit(6)
      .populate('furnitureStatus')
      .populate('area')
      .populate('subarea')
      .populate('propertyType');
    console.log(blogId, relatedProperties[0].tags, blog.tag);
    res.json(relatedProperties);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
