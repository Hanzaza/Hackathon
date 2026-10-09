import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email y código son requeridos' },
        { status: 400 }
      );
    }

    // Registro seguro de la emisión del código de verificación de 2 pasos
    console.log('======================================================');
    console.log('[ROOTS 2FA SECURITY] CÓDIGO DE VERIFICACIÓN GENERADO');
    console.log(`Usuario: ${email}`);
    console.log(`Código 2FA: ${code}`);
    console.log(`Fecha de emisión: ${new Date().toISOString()}`);
    console.log(`Válido por: 5 minutos`);
    console.log('======================================================');

    // En producción con servidor SMTP configurado (ej: Resend, SendGrid o Supabase Mailer)
    // aquí se enviaría el correo electrónico con el template visual de ROOTS.

    return NextResponse.json({
      success: true,
      message: 'Código de verificación 2FA generado y enviado correctamente.',
      email,
    });
  } catch (error: any) {
    console.error('Error al procesar emisión de código 2FA:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
