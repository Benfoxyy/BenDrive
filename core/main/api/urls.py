from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path('store/list', views.StoredFileListView.as_view(), name='store-list-file'),
    path('store/file', views.StoreFileView.as_view(), name='store-file'),
    path('delete/file/<int:pk>/', views.DeleteFileView.as_view(), name='delete-file'),
]
