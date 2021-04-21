#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bookshelf.config.settings")
    os.environ.setdefault("DJANGO_ENV", "prod")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
