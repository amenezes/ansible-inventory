FROM amenezes/pandas:0.23.4

LABEL maintainer="alexandre menezes <alexandre.fmenezes@gmail.com>"

WORKDIR /app

COPY ./ .

RUN apk add --no-cache curl build-base && \
  pip install -r requirements.txt && \
  chmod +x docker/docker-entrypoint.sh

EXPOSE 5000

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=4 \
  CMD curl http://localhost:5000/summary/.json || exit 1

ENV FACTS_REPORT reports/
ENV FLASK_ENV production

VOLUME /app/reports

ENTRYPOINT ["/app/docker/docker-entrypoint.sh"]
