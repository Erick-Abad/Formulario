const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    const { nombre, apellidos, pais, ciudad, direccion, telefono } = req.body;

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL,
        subject: "Nueva Inscripción al Curso",
        text: `
            Nombre: ${nombre}
            Apellidos: ${apellidos}
            País: ${pais}
            Ciudad: ${ciudad}
            Dirección: ${direccion}
            Teléfono: ${telefono}
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Correo enviado con éxito" });
    } catch (error) {
        console.error("Error al enviar correo:", error);
        res.status(500).json({ error: "Error al enviar el correo" });
    }
};
