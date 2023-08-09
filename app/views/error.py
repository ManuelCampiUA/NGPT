from flask import Blueprint, render_template

error_views = Blueprint("error_views", __name__)


@error_views.app_errorhandler(403)
def error(e):
    status = "403 Forbidden"
    error = "You don't have the permission to access the requested resource"
    return render_template("error.html", status=status, error=error), 403


@error_views.app_errorhandler(404)
def error(e):
    status = "404 Not Found"
    error = "The requested URL was not found on the server"
    return render_template("error.html", status=status, error=error), 404
