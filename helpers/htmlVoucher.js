const htmlVoucher= ({date, amount, platform, encryptedId}) =>{
    return (`
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Comprobante</title>
  </head>
  <body>
    <div>
      <div
        style="
          border: 2px solid black;
          width: 500px;
          padding: 30px 13px;
          position: relative;
          top: 80px;
          margin: auto;
          border-style: dotted;
        "
      >
        <h3 style="text-align: center">SuperSistemasWeb</h3>
        <hr />
        <p>Fecha de pago: ${date}</p>
        <p>Platform: ${platform}</p>
        <p>Monto: $${amount}</p>
        <p>Numero de transacción: ${encryptedId}</p>
      </div>
    </div>
  </body>
</html>

    `)
}

module.exports={
    htmlVoucher
}