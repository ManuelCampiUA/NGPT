FROM python

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install build-essential -y

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

RUN flask initdb

CMD ["waitress-serve", "--call", "app:create_app"]