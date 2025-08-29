from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Ruta principal (HTML)
@app.route('/')
def index():
    return render_template('index.html')

# API: Guardar empleado
@app.route('/api/empleados', methods=['POST'])
def guardar_empleado():
    data = request.json
    conn = sqlite3.connect('empleados.db')
    cursor = conn.cursor()
    
    cursor.execute('''
    INSERT INTO empleados (nombre, cargo, departamento, sueldo, fecha_contratacion)
    VALUES (?, ?, ?, ?, ?)
    ''', (data['nombre'], data['cargo'], data['departamento'], data['sueldo'], data['fecha']))
    
    conn.commit()
    conn.close()
    return jsonify({"mensaje": "Empleado guardado correctamente"})

# API: Buscar empleados
@app.route('/api/empleados', methods=['GET'])
def buscar_empleados():
    query = request.args.get('query', '')
    conn = sqlite3.connect('empleados.db')
    cursor = conn.cursor()
    
    cursor.execute('''
    SELECT * FROM empleados 
    WHERE id LIKE ? OR nombre LIKE ? OR cargo LIKE ?
    ''', (f'%{query}%', f'%{query}%', f'%{query}%'))
    
    empleados = cursor.fetchall()
    conn.close()
    
    # Convertir resultados a lista de diccionarios
    resultados = []
    for emp in empleados:
        resultados.append({
            "id": emp[0],
            "nombre": emp[1],
            "cargo": emp[2],
            "departamento": emp[3],
            "sueldo": emp[4],
            "fecha": emp[5]
        })
    
    return jsonify(resultados)

if __name__ == '__main__':
    app.run(debug=True)