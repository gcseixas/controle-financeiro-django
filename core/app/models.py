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
    
    @classmethod
    def filtrar (cls, usuario, mes=None, ano=None):
        queryset = cls.objects.filter(usuario=usuario)
        
        if mes:
            queryset = queryset.filter(data__month=mes)

        if ano:
            queryset = queryset.filter(data__year=ano)

        return queryset
    
    @classmethod
    def pegar_anos(cls, usuario):
        return (
            cls.objects
            .filter(usuario=usuario)
            .values_list("data__year", flat=True)
            .distinct()
            .order_by("data__year")
        )
        
    @staticmethod
    def calcular_total(queryset):
        from django.db.models import Sum
        return queryset.aggregate(total=Sum("valor"))["total"] or 0
            
        
    @staticmethod
    def nome_do_mes(numero_mes):
        meses = {
            1: "Janeiro",
            2: "Fevereiro",
            3: "Março",
            4: "Abril",
            5: "Maio",
            6: "Junho",
            7: "Julho",
            8: "Agosto",
            9: "Setembro",
            10: "Outubro",
            11: "Novembro",
            12: "Dezembro",
        }

        return meses.get(numero_mes, "")


