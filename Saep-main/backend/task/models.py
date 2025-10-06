from django.db import models

class User(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.username
    
class Task(models.Model):
    priority_choices = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    status_choices = [
        ('todo', 'To Do'),
        ('doing', 'Doing'),
        ('done', 'Done'),
    ]

    description = models.TextField()
    department = models.CharField(max_length=100)
    created_at = models.DateField(auto_now_add=True)
    priority = models.CharField(max_length=6, choices=priority_choices)
    status = models.CharField(max_length=5, choices=status_choices, default='todo')
    user = models.ForeignKey(User, on_delete=models.CASCADE)


    def __str__(self):
        return self.description