require('dotenv').config();
const fs = require('fs');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Método no permitido' });
        }

        const { nombre, apellidos, pais, ciudad, direccion, telefono } = req.body;

        if (!nombre || !apellidos || !pais || !ciudad || !direccion || !telefono) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Crear el PDF con los datos
        const pdfPath = `./inscripcion_${nombre}_${apellidos}.pdf`;
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(pdfPath));

        doc.fontSize(18).text('Confirmación de Inscripción', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Nombre: ${nombre}`);
        doc.text(`Apellidos: ${apellidos}`);
        doc.text(`País: ${pais}`);
        doc.text(`Ciudad: ${ciudad}`);
        doc.text(`Dirección: ${direccion}`);
        doc.text(`Teléfono: ${telefono}`);
        doc.moveDown();
        doc.fontSize(12).text('¡Gracias por inscribirte!', { align: 'center' });

        doc.end();

        // Configuración de Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: 'Nueva Inscripción al Curso',
            text: `
                Nombre: ${nombre}
                Apellidos: ${apellidos}
                País: ${pais}
                Ciudad: ${ciudad}
                Dirección: ${direccion}
                Teléfono: ${telefono}
            `,
            attachments: [
                {
                    filename: `Inscripción_${nombre}_${apellidos}.pdf`,
                    path: pdfPath
                }
            ]
        };

        // Enviar el correo con el PDF adjunto
        await transporter.sendMail(mailOptions);
        
        // Eliminar el PDF después de enviarlo
        fs.unlinkSync(pdfPath);

        res.status(200).json({ message: 'Correo enviado con éxito con PDF adjunto' });

    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
