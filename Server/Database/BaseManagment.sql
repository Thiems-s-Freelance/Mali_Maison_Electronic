CREATE DATABASE QuoteRequestDb
ON PRIMARY (
    NAME = QuoteRequestDb,
    FILENAME = 'E:\Devellopment_projects\Mali_Maison_Electronique\Server\Database\QuoteRequests\QuoteRequestDb.mdf'
)
LOG ON (
    NAME = QuoteRequestDb_log,
    FILENAME = 'E:\Devellopment_projects\Mali_Maison_Electronique\Server\Database\QuoteRequests\QuoteRequestDb_log.ldf'
);
