CREATE DATABASE CameraDb
ON PRIMARY (
    NAME = CameraDb,
    FILENAME = 'E:\Devellopment_projects\Mali_Maison_Electronique\Server\Database\Camera\CameraDb.mdf'
)
LOG ON (
    NAME = CameraDb_log,
    FILENAME = 'E:\Devellopment_projects\Mali_Maison_Electronique\Server\Database\Camera\CameraDb_log.ldf'
);
