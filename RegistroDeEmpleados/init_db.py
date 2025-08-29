import sqlite3

# Conectar a la base de datos (se crea si no existe)
conn = sqlite3.connect('empleados.db')
cursor = conn.cursor()

# Crear tabla 'empleados'
cursor.execute('''
CREATE TABLE IF NOT EXISTS empleados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    cargo TEXT NOT NULL,
    departamento TEXT,
    sueldo REAL NOT NULL,
    fecha_contratacion TEXT
)
''')

conn.commit()
conn.close()