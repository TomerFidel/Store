const httpResponse = function () {
    this.success = true;
    this.data = [];
    this.message = "";

    this.setError = (msg) => {
        this.success = false;
        this.message = msg;
    }

    this.setSuccess = (msg) => {
        this.success = true;
        this.message = msg;
    }


}

module.exports = httpResponse;