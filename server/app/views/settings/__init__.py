from flask import Blueprint, render_template, request, url_for, redirect
from ..auth import login_required, admin_required
from .utils import set_api_key, get_api_key, get_temp_password

settings_views = Blueprint("settings_views", __name__)


@settings_views.route("/settings", methods=("GET", "POST"))
@login_required
@admin_required
def settings():
    if request.method == "POST":
        set_api_key(request.form["APIKey"])
        return redirect(url_for("chat_views.chat"))
    return render_template(
        "settings.html", APIKey=get_api_key(), temppassword=get_temp_password()
    )
