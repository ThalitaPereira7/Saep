from django.urls import path
from .views import TasksRetrieveUpdateDestroyView, TaskListCreateView, UserRetrieveUpdateDestroyView, UserListCreateView

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>', TasksRetrieveUpdateDestroyView.as_view(), name='task-crud'),

    path('user/', UserListCreateView.as_view(), name='user-list-create'),
    path('user/<int:pk>', UserRetrieveUpdateDestroyView.as_view(), name='user-list-create'),
]