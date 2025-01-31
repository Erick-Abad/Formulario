const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    try {
        console.log("📩 Iniciando envío de correo...");

        if (req.method !== "POST") {
            return res.status(405).json({ error: "Método no permitido" });
        }

        const { nombre, apellidos, pais, ciudad, direccion, telefono } = req.body;
        console.log("📩 Datos recibidos:", req.body);

        if (!nombre || !apellidos || !pais || !ciudad || !direccion || !telefono) {
            console.error("❌ Faltan datos en el formulario.");
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECEIVER_EMAIL) {
            console.error("❌ Error: Variables de entorno faltantes.");
            return res.status(500).json({ error: "Error en el servidor (ENV Missing)" });
        }

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
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
        console.log("✅ Correo enviado correctamente");
        return res.status(200).json({ message: "Correo enviado con éxito" });

    } catch (error) {
        console.error("❌ Error al enviar correo:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
};

