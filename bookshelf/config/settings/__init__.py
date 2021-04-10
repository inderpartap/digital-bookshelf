import os

environment = os.environ.get('DJANGO_ENV', "")

# environment = 'dev'
#
print ("ENVIRONMENT: " + environment)

from bookshelf.config.settings.main import *

if environment == "dev":
    from bookshelf.config.settings.dev import *
elif environment == "local":
    from bookshelf.config.settings.local import *
else:
    from bookshelf.config.settings.prod import *
