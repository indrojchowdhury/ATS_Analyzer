from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        read_only_fields = fields


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        style={"input_type": "password"},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        style={"input_type": "password"},
    )

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this username already exists."
            )
        try:
            User._meta.get_field("username").run_validators(value)
        except ValidationError as exc:
            raise serializers.ValidationError(list(exc.messages)) from exc
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )

        candidate_user = User(
            username=attrs["username"],
            email=attrs["email"],
        )
        try:
            validate_password(attrs["password"], user=candidate_user)
        except ValidationError as exc:
            raise serializers.ValidationError(
                {"password": list(exc.messages)}
            ) from exc

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
        style={"input_type": "password"},
    )

    def validate(self, attrs):
        identifier = attrs["identifier"].strip()
        username = identifier

        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            if user is not None:
                username = user.get_username()

        user = authenticate(
            request=self.context.get("request"),
            username=username,
            password=attrs["password"],
        )
        if user is None:
            raise serializers.ValidationError(
                {"detail": "Invalid username/email or password."}
            )

        attrs["user"] = user
        return attrs
