<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdminRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return $this->user()->hasRole('administrator');
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'name' => 'required|string|max:255',
      'email' => 'required|email|unique:users,email',
      'phone' => 'required|string|max:20',
      'password' => 'required|string|min:8|confirmed',
    ];
  }

  /**
   * Get custom messages for validator errors.
   *
   * @return array<string, string>
   */
  public function messages(): array
  {
    return [
      'name.required' => 'Admin name is required.',
      'email.required' => 'Email address is required.',
      'email.email' => 'Please provide a valid email address.',
      'email.unique' => 'This email is already registered.',
      'phone.required' => 'Phone number is required.',
      'password.required' => 'Password is required.',
      'password.min' => 'Password must be at least 8 characters.',
      'password.confirmed' => 'Password confirmation does not match.',
    ];
  }
}
