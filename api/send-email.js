const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Método no permitido" });
        }

        const { nombre, apellidos, pais, ciudad, direccion, telefono } = req.body;

        if (!nombre || !apellidos || !pais || !ciudad || !direccion || !telefono) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Verificar que las variables de entorno estén definidas
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECEIVER_EMAIL) {
            console.error("Error: Faltan variables de entorno para el correo.");
            return res.status(500).json({ error: "Error interno del servidor" });
        }

        // Configuración de Nodemailer con Gmail o SMTP personalizado
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Evita problemas con certificados SSL
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

        await transporter.sendMail(mailOptions);
        console.log("Correo enviado correctamente");
        return res.status(200).json({ message: "Correo enviado con éxito" });

    } catch (error) {
        console.error("Error al enviar correo:", error);
        return res.status(500).json({ error: "Error al enviar el correo" });
    }
};
