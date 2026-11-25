FROM easypi/json-server

WORKDIR /data

COPY data/db.json /data/db.json

ENV PORT=10000

EXPOSE 10000

ENTRYPOINT []

CMD ["sh", "-c", "exec json-server /data/db.json --host 0.0.0.0 --port \"$PORT\""]