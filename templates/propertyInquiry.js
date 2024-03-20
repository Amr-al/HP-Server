module.exports = function (title, image, refNumber, beds, baths, area, price, name) {
    return `
          <div>
              <h2>Dear ${name}</h2>
              <p style="margin: 5px 0">Thank You for contacting us</p>
              <p style="margin: 5px 0">We've received your inquiry about the below property</p>
              <div style="">
                <h1 style="text-align:center;font-size:22px;font-weight:800">${title}</h1>
                <img src=${image}/>
                <p>Reference Number: ${refNumber}</p>
                <p>Bedrooms: ${beds}</p>
                <p>Bathrooms: ${baths}</p>
                <p>Property Area: ${area}</p>
                <p>Price: ${price}</p>
              </div>
              <h2>Thank you for choosing us</h2>
          </div>
      `;
};
