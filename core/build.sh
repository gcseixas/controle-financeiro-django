#!/usr/bin/env bash
set -o errexit

python -m pip install --upgrade pip
pip install -r requirements.txt

python core/manage.py collectstatic --noinput
python core/manage.py migrate
python core/manage.py createsuperuser --noinput || true
