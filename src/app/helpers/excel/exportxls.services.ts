import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})

export class exportExcelService {

    constructor(private _toastrService: ToastrService) { }

    ec(r, c) {
        return XLSX.utils.encode_cell({ r: r, c: c });
    }

    eliminarFila(ws, row_index) {
        var variable = XLSX.utils.decode_range(ws["!ref"])
        for (var R = row_index; R < variable.e.r; ++R) {
            for (var C = variable.s.c; C <= variable.e.c; ++C) {
                ws[this.ec(R, C)] = ws[this.ec(R + 1, C)];
            }
        }
        variable.e.r--
        ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
    }

    combinarDatosConColumnas(data: any[], columnas): any[] {
        let tablaFinal: any[] = [];
        let tablaTemportal: any[] = [];
        let filaTemnportal: any[] = [];

        tablaFinal.push(columnas);

        if (data) {
            data.forEach((valor, posicionData) => {

                for (let i = 0; i < columnas.length; i++) {
                    let nombreColumnaReporte = columnas[i];

                    let valorAsignar = "";
                    if (valor[nombreColumnaReporte] != null) {
                        valorAsignar = valor[nombreColumnaReporte];
                    }

                    filaTemnportal[posicionData] = valorAsignar;
                    tablaTemportal.push(filaTemnportal[posicionData]);

                    if (tablaTemportal.length == columnas.length) {
                        tablaFinal.push(tablaTemportal);
                        tablaTemportal = [];
                    }
                }

            });
        }

        return tablaFinal;
    }

    exportarXls(totalRegistros, columnas, nombreArchivo, informacion) {
        if (totalRegistros > 0) {
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.combinarDatosConColumnas(informacion, columnas));

            const wb: XLSX.WorkBook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

            const date = new Date();

            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let hour = date.getHours();
            let minute = date.getMinutes();
            let seconds = date.getSeconds();

            this.eliminarFila(ws, 0);

            XLSX.writeFile(wb, nombreArchivo + "_" + year + month + day + hour + minute + seconds + '.xlsx', {
                type: 'base64'
            });

            this._toastrService.success('!Se exportaron los registros satisfactoriamente!');
            return true;
        } else {
            this._toastrService.warning('¡No existen registros para exportar!');
            return false;
        }
    }
}