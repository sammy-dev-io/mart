import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")

def send_verification_email(to_email: str, full_name: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    verification_link = f"{frontend_url}/verify-email?token={token}"

    try:
        resend.Emails.send({
            "from": "Mart <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "Verify your Mart account",
            "html": f"""
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                    <h2 style="color: #0f172a;">Welcome to Mart, {full_name.split()[0]}</h2>
                    <p style="color: #71717a; font-size: 14px; line-height: 1.6;">
                        Thanks for signing up. Please verify your email address to activate your account.
                    </p>
                    <a href="{verification_link}"
                       style="display: inline-block; background: #f59e0b; color: #fff; padding: 12px 24px;
                              border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
                        Verify Email Address
                    </a>
                    <p style="color: #a1a1aa; font-size: 12px;">
                        If you did not create this account, you can safely ignore this email.
                    </p>
                </div>
            """
        })
    except Exception as e:
        print(f"Failed to send verification email: {e}")