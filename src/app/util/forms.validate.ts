export const validarEmail = (email): boolean => {
    let expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!expr.test(email.target.value)) {
        email.target.value = '';
        email.target.focus();
        return true;
    } else {
        return false;
    }
}

export const rellenaCaracteres = (ctl): boolean => {
    let j = ctl.target.maxLength - ctl.target.value.length;
    if (ctl.target.value.length > 0) {
        let t = '';
        for (let i = 0; i < j; i++) {
            t += '0';
        }
        ctl.target.value = t + ctl.target.value;
    }
    return false;
}

export const primer9 = (e): boolean => {
    let prim_val = e.target.value.charAt(0);
    if (prim_val >= 0 && prim_val <= 8) {
        e.target.value = "";
    }
    return false;
}

export const limpiarNumero = (obj): boolean => {
    obj.target.value = obj.target.value.replace(/\D/g, '');
    return false;
}

export const limpiarLetras = (obj): boolean => {
    obj.target.value = obj.target.value.replace(/[0-9]/g, '');
    return false;
}

export const soloNumeros = (e): boolean => {
    let key = window.Event ? e.which : e.keyCode
    return (key >= 48 && key <= 57)
}

export const soloDecimales = (obj): boolean => {
    obj.target.value = obj.target.value.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
    return false;
}

export const soloLetras = (e): boolean => {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    let especiales = [8, 37, 39, 46];
    let tecla_especial = false
    for (let i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
        return false;
    } else {
        return true;
    }
}