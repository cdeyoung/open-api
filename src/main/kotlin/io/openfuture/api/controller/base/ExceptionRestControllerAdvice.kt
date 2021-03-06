package io.openfuture.api.controller.base

import io.openfuture.api.domain.exception.ErrorDto
import io.openfuture.api.domain.exception.ExceptionResponse
import io.openfuture.api.exception.CompileException
import io.openfuture.api.exception.DeployException
import io.openfuture.api.exception.TemplateProcessingException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus.BAD_REQUEST
import org.springframework.http.HttpStatus.CONFLICT
import org.springframework.validation.BindException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ExceptionRestControllerAdvice {

    @ResponseStatus(code = BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun methodArgumentNotValidExceptionHandler(exception: MethodArgumentNotValidException): ExceptionResponse =
            ExceptionResponse(BAD_REQUEST.value(), BAD_REQUEST.reasonPhrase, exception.bindingResult.allErrors.map { ErrorDto(it) })

    @ResponseStatus(code = BAD_REQUEST)
    @ExceptionHandler(BindException::class)
    fun bindExceptionHandler(exception: BindException): ExceptionResponse =
            ExceptionResponse(BAD_REQUEST.value(), BAD_REQUEST.reasonPhrase, exception.bindingResult.allErrors.map { ErrorDto(it) })

    @ResponseStatus(code = CONFLICT)
    @ExceptionHandler(DataIntegrityViolationException::class)
    fun dataIntegrityViolationExceptionHandler(exception: DataIntegrityViolationException): ExceptionResponse =
            ExceptionResponse(CONFLICT.value(), exception.message ?: "Data Integrity Violation")

    @ResponseStatus(code = BAD_REQUEST)
    @ExceptionHandler(CompileException::class)
    fun compileExceptionHandler(exception: CompileException): ExceptionResponse =
            ExceptionResponse(BAD_REQUEST.value(), exception.message ?: "Compile Exception")

    @ResponseStatus(code = BAD_REQUEST)
    @ExceptionHandler(DeployException::class)
    fun deployExceptionHandler(exception: DeployException): ExceptionResponse =
            ExceptionResponse(BAD_REQUEST.value(), exception.message ?: "Deploy Exception")

    @ResponseStatus(code = BAD_REQUEST)
    @ExceptionHandler(TemplateProcessingException::class)
    fun templateProcessionExceptionHandler(exception: TemplateProcessingException): ExceptionResponse =
            ExceptionResponse(BAD_REQUEST.value(), exception.message ?: "Template Processing Exception")

    @ResponseStatus(code = BAD_REQUEST)
    @ExceptionHandler(IllegalStateException::class)
    fun illegalStateExceptionHandler(exception: IllegalStateException): ExceptionResponse =
            ExceptionResponse(BAD_REQUEST.value(), exception.message ?: "Illegal State Exception")


}