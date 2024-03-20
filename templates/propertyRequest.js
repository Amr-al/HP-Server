module.exports = function (title, image, refNumber, beds, baths, area, price, name, message, phone, email, url) {
  return `
          <div style="color:#475569">
              <hr/>
              <div style="">
                <h1 style="text-align:center;font-size:22px;font-weight:800;color:black">${title}</h1>
                <img src="${image}" style="width:100%"/>
                <p>Reference # : ${refNumber}</p>
                <p>Bedrooms : ${beds}</p>
                <p>Bathrooms : ${baths}</p>
                <p>Property Area : ${area}</p>
                <p>Price : ${price}</p>
                <button style="background-color:#095668"><a href="${url}" style="color:white;text-decoration:none;">View The Property</a></button>
              </div>
              <hr/>
              <div style="">
                <p>Name : ${name}</p>
                <p>Message : ${message}</p>
                <p>Email : ${email}</p>
                <p>Phone Number : <a href="tel:${phone}">${phone}</a></p>
              </div>
          </div>
      `;
};
