require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const pdf = require('pdfkit');

module.exports = async (req, res) => {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Método no permitido" });
        }

        const { nombre, apellidos, pais, ciudad, direccion, telefono } = req.body;

        if (!nombre || !apellidos || !pais || !ciudad || !direccion || !telefono) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Verificar variables de entorno
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.RECEIVER_EMAIL) {
            console.error("❌ Error: Variables de entorno faltantes en Vercel.");
            return res.status(500).json({ error: "Error en el servidor (ENV Missing)" });
        }

        // 📄 **Crear PDF con la información del formulario**
        const pdfDoc = new pdf();
        const pdfFileName = `inscripcion_${nombre}_${apellidos}.pdf`;
        const pdfFilePath = `/tmp/${pdfFileName}`; // Directorio temporal para Vercel

        pdfDoc.pipe(fs.createWriteStream(pdfFilePath));
        pdfDoc.fontSize(20).text("Inscripción al Curso", { align: "center" });
        pdfDoc.moveDown();
        pdfDoc.fontSize(14).text(`Nombre: ${nombre}`);
        pdfDoc.text(`Apellidos: ${apellidos}`);
        pdfDoc.text(`País: ${pais}`);
        pdfDoc.text(`Ciudad: ${ciudad}`);
        pdfDoc.text(`Dirección: ${direccion}`);
        pdfDoc.text(`Teléfono: ${telefono}`);
        pdfDoc.end();

        // 📧 **Configurar el correo con Nodemailer**
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: { rejectUnauthorized: false }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: "Nueva Inscripción al Curso",
            text: `Nueva inscripción:\n\nNombre: ${nombre}\nApellidos: ${apellidos}\nPaís: ${pais}\nCiudad: ${ciudad}\nDirección: ${direccion}\nTeléfono: ${telefono}`,
            attachments: [
                {
                    filename: pdfFileName,
                    path: pdfFilePath,
                    contentType: 'application/pdf'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Correo enviado correctamente");
        return res.status(200).json({ message: "Correo enviado con éxito" });

    } catch (error) {
        console.error("❌ Error en el servidor:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
};
