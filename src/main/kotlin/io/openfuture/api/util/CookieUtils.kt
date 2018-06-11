package io.openfuture.api.util

import javax.servlet.http.Cookie
import javax.servlet.http.HttpServletResponse

/**
 * @author Alexey Skadorva
 */
object CookieUtils {

    fun add(name: String, value: String, response: HttpServletResponse) {
        val cookie = create(name, value)

        response.addCookie(cookie)
    }

    fun expire(name: String, value: String, response: HttpServletResponse) {
        val cookie = create(name, value)
        cookie.maxAge = 0

        response.addCookie(cookie)
    }

    private fun create(name: String, value: String): Cookie {
        val cookie = Cookie(name, value)
        cookie.path = "/"

        return cookie
    }

}