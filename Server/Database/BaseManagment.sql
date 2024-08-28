CREATE TABLE Camera (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100) NOT NULL,
    Model NVARCHAR(100) NOT NULL,
    Stock INT NOT NULL,
    Price DECIMAL(18, 2) NOT NULL
);

CREATE TABLE QuoteRequest (
    Id INT PRIMARY KEY IDENTITY,
    FirstName NVARCHAR(100) NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    RequestTime DATETIME NOT NULL,
    TotalPrice DECIMAL(18, 2) NOT NULL
);

-- Table pour la relation entre les devis et les caméras
CREATE TABLE QuoteRequestCamera (
    QuoteRequestId INT,
    CameraId INT,
    Quantity INT NOT NULL,
    PRIMARY KEY (QuoteRequestId, CameraId),
    FOREIGN KEY (QuoteRequestId) REFERENCES QuoteRequest(Id),
    FOREIGN KEY (CameraId) REFERENCES Camera(Id)
);