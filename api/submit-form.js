import { Resend } from 'resend';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nombre, correo } = req.body;

        if (!nombre || !correo) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        try {
            await resend.emails.send({
                from: 'noreply@tu-dominio.com',
                to: process.env.RECEIVER_EMAIL,
                subject: 'Nueva Inscripción al Curso de Excel',
                html: `<p><strong>Nombre:</strong> ${nombre}</p><p><strong>Correo:</strong> ${correo}</p>`
            });
            res.status(200).json({ message: 'Correo enviado con éxito' });
        } catch (error) {
            console.error("Error al enviar correo:", error);
            res.status(500).json({ error: 'Error al enviar el correo' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
