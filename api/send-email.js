const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { nombre, correo } = req.body;

        if (!nombre || !correo) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: 'Nueva Inscripción al Curso de Excel',
            text: `Nombre: ${nombre}\nCorreo: ${correo}`
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: 'Correo enviado con éxito' });
        } catch (error) {
            console.error("Error al enviar correo:", error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
};
