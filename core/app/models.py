from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    email = models.EmailField(
        unique=True,
        blank=False,
        null=False
    )
    
    nome = models.CharField(
        max_length=100,
        blank=False,
        null=False
    )

    def __str__(self):
        return f"Nome: {self.nome} | Username: {self.username}"
    

class Gasto(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    descricao = models.CharField(max_length=200, blank=False)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data = models.DateField()
    criado_em = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return f"Descrição: {self.descricao} | Valor: {self.valor}"