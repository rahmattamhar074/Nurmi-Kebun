<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'subject' => ['required', 'string', 'max:255'],
            'order_id' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:10'],
            'attachment' => ['nullable', 'file', 'max:2048', 'mimes:jpg,jpeg,png,gif,webp,pdf'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'subject.required' => 'Please provide a subject for your ticket.',
            'message.required' => 'Please describe your issue.',
            'message.min' => 'Please provide more details (at least 10 characters).',
            'attachment.max' => 'File size must not exceed 2MB.',
            'attachment.mimes' => 'Only images (jpg, png, gif, webp) and PDF files are allowed.',
        ];
    }
}
