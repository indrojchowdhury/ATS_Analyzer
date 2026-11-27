from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


User = get_user_model()


class AuthenticationAPITests(APITestCase):
    register_url = "/api/auth/register/"
    login_url = "/api/auth/login/"

    def test_registration_creates_user_and_returns_token(self):
        response = self.client.post(
            self.register_url,
            {
                "username": "ats_user",
                "email": "ats@example.com",
                "password": "Strong!Passphrase487",
                "password_confirm": "Strong!Passphrase487",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(username="ats_user").exists())
        self.assertTrue(response.data["data"]["token"])
        self.assertEqual(response.data["data"]["user"]["email"], "ats@example.com")

    def test_registration_rejects_mismatched_passwords(self):
        response = self.client.post(
            self.register_url,
            {
                "username": "ats_user",
                "email": "ats@example.com",
                "password": "Strong!Passphrase487",
                "password_confirm": "Different!Passphrase487",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(User.objects.filter(username="ats_user").exists())

    def test_login_accepts_email_and_token_authenticates_user(self):
        User.objects.create_user(
            username="ats_user",
            email="ats@example.com",
            password="Strong!Passphrase487",
        )

        response = self.client.post(
            self.login_url,
            {
                "identifier": "ATS@example.com",
                "password": "Strong!Passphrase487",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        token = response.data["data"]["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        current_user = self.client.get("/api/auth/me/")
        self.assertEqual(current_user.status_code, 200)
        self.assertEqual(current_user.data["data"]["user"]["username"], "ats_user")

    def test_logout_invalidates_token(self):
        user = User.objects.create_user(
            username="ats_user",
            email="ats@example.com",
            password="Strong!Passphrase487",
        )
        from rest_framework.authtoken.models import Token

        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        response = self.client.post("/api/auth/logout/")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Token.objects.filter(user=user).exists())
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)
