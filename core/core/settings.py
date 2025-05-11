from pathlib import Path
from decouple import config
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'rgwrgwrghsrnbsthsr'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework_simplejwt',
    'rest_framework',
    'django_filters',
    'drf_yasg',
    'minio_storage',

    'accounts',
    'main',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": config(
            "DB_ENGINE", default="django.db.backends.postgresql"
        ),
        "NAME": config("DB_NAME", default="postgres"),
        "USER": config("DB_USER", default="postgres"),
        "PASSWORD": config("DB_PASS", default="postgres"),
        "HOST": config("DB_HOST", default="db"),
        "PORT": config("DB_PORT", cast=int, default=5432),
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = (
    BASE_DIR / "static"
)  # Where `collectstatic` will gather files (optional in dev)

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = "accounts.User"

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',   
    ),
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=8),
}

# -------------------------
# ✅ MEDIA FILES (MinIO)
# -------------------------

# Use MinIO for media files
DEFAULT_FILE_STORAGE = "minio_storage.storage.MinioMediaStorage"

# MinIO Connection Details
MINIO_STORAGE_ENDPOINT = config("MINIO_STORAGE_ENDPOINT", default="minio:9000")
MINIO_EXTERNAL_STORAGE_ENDPOINT = config("MINIO_EXTERNAL_STORAGE_ENDPOINT", default="http://127.0.0.1:9000")

# MinIO Authentication
MINIO_STORAGE_ACCESS_KEY = config("MINIO_STORAGE_ACCESS_KEY", default="minioadmin")
MINIO_STORAGE_SECRET_KEY = config("MINIO_STORAGE_SECRET_KEY", default="minioadmin")
MINIO_STORAGE_USE_HTTPS = config("MINIO_STORAGE_USE_HTTPS", cast=bool, default=False)

# MinIO Media Bucket Settings
MINIO_STORAGE_MEDIA_BUCKET_NAME = config("MINIO_STORAGE_MEDIA_BUCKET_NAME", default="media")
MINIO_STORAGE_MEDIA_USE_PRESIGNED = False  # True if you want signed URLs for private access
MINIO_STORAGE_AUTO_CREATE_MEDIA_BUCKET = True  # Auto-create bucket if not exists

# URL to access media files from MinIO
MEDIA_URL = f"{MINIO_EXTERNAL_STORAGE_ENDPOINT}/{MINIO_STORAGE_MEDIA_BUCKET_NAME}/"