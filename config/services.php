<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'shipping' => [
        'api_base_url' => env('RAJAONGKIR_BASE_URL'),
        'api_key' => env('RAJAONGKIR_SHIPPING_KEY'),
        'origin_district_id' => env('SHIPPING_ORIGIN_ZIPCODE'),
        'biteship_base_url' => env('BITESHIP_BASE_URL'),
        'biteship_api_key' => env('BITESHIP_API_KEY'),
        'origin_postal_code' => env('SHIPPING_ORIGIN_POSTAL_CODE'),
    ],

];
