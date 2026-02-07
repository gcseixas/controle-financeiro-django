#!/usr/bin/env bash

python -m pip install --upgrade pip
pip install -r requirements.txt
python core/manage.py collectstatic --noinput
python core/manage.py migrate
