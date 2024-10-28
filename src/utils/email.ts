import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'
dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export const sendMail = async ({
  to,
  from,
  subject,
  text,
  html
}: {
  to: string
  from: string
  subject: string
  text: string
  html: string
}) => {
  const msg = {
    to,
    from,
    subject,
    text: text,
    html: html
  }

  try {
    await sgMail.send(msg)
  } catch (error: any) {
    throw error
  }
}
