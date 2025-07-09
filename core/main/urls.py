from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path('file/list/', views.StoredFileListView.as_view(), name='file-list'),
    path('file/upload/', views.StoreFileView.as_view(), name='file-upload'),
    path('file/delete/<int:pk>/', views.DeleteFileView.as_view(), name='file-delete'),
    path('file/share/list/', views.ShareListFileView.as_view(), name='file-remove-share'),
    path('file/share/add/', views.ShareAddFileView.as_view(), name='file-add-share'),
    path('file/share/remove/', views.ShareRemoveFileView.as_view(), name='file-share-share'),
]
