from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.conf import settings


class FileModel(models.Model):
    owner = models.ForeignKey("accounts.Profile", on_delete=models.CASCADE)
    shares_with = models.ManyToManyField(
        "accounts.Profile",
        related_name="shared_files",
        blank=True,
    )
    file = models.FileField(upload_to="user_uploads/")
    size = models.PositiveBigIntegerField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.file and not self.size:
            self.size = self.file.size
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.owner.user.email} - {self.size}"

    @property
    def file_url(self):
        return f"{settings.MINIO_STORAGE_MEDIA_URL}/{self.file.name}"

    @property
    def file_size_in_mb(self):
        size_in_mb = self.size / (1024 * 1024)
        return f"{size_in_mb:.3f} MB"


@receiver(post_delete, sender=FileModel)
def delete_file_from_storage(sender, instance, **kwargs):
    if instance.file:
        instance.file.delete(save=False)
