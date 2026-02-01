<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReplyTicketRequest extends FormRequest
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
            'message' => ['required', 'string'],
            'attachment' => ['nullable', 'file', 'max:2048', 'mimes:jpg,jpeg,png,gif,webp,pdf'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'message.required' => 'Please enter your reply message.',
            'message.min' => 'Please provide more details (at least 10 characters).',
            'attachment.max' => 'File size must not exceed 2MB.',
            'attachment.mimes' => 'Only images (jpg, png, gif, webp) and PDF files are allowed.',
        ];
    }
}
