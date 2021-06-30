const fs     = require('fs');

const htmlVoucher = ({ date, amount, platform, encryptedId, status }) => {
    return (`
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Comprobante</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="">
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap"
      rel="stylesheet"
    />
  </head>
  <body style="font-family: 'Roboto', sans-serif">
    <div>
      <div
        style="
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          width: 500px;
          padding: 30px 13px;
          position: relative;
          top: 80px;
          margin: auto;
          border-style: dotted;
          overflow-wrap: break-word;
        "
      >
      <div style="display: flex; justify-content: center; align-items: center; width: 100%; text-align:center;">
          <img style="
          text-align:center;
          width: 130px;
          height:50px;
          margin-bottom: 0.3rem;"
          src="https://www.pagosx.com/logoSS-PX.jpg"/>
        </div>
        <hr/>
        <p>Fecha de pago: ${date}</p>
        <p>
          Platform: ${platform===undefined?('Transferencia Bancaria'):(platform)}
        </p>
        <p>Monto: $${amount}</p>
        <p>Transacción: ${encryptedId}</p>
        <p>Estado: ${status}</p>
      </div>
    </div>
  </body>
</html>

    

    `)
}

module.exports = {
    htmlVoucher
}