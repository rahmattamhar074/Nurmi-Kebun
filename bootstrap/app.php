<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Uncomment this when you have sidebar state
        // $middleware->encryptCookies(except: ['sidebar:state']);

        // Exclude cart API from CSRF verification (uses session auth instead)
        $middleware->validateCsrfTokens(except: [
            'api/cart',
            'api/cart/*',
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleTheme::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);
        // =========================================================
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, \Throwable $exception, \Illuminate\Http\Request $request) {
            // Only use custom error pages in production
            if (!app()->environment('local') && in_array($response->getStatusCode(), [500, 503, 404, 403, 401])) {
                // Map status codes to error page components
                $errorPages = [
                    401 => 'errors/401',
                    403 => 'errors/403',
                    404 => 'errors/404',
                    500 => 'errors/500',
                    503 => 'errors/500',
                ];

                $page = $errorPages[$response->getStatusCode()] ?? 'errors/500';

                return \Inertia\Inertia::render($page)
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            }

            // Handle 419 (CSRF token mismatch)
            if ($response->getStatusCode() === 419) {
                return back()->with([
                    'message' => 'The page expired, please try again.',
                ]);
            }

            return $response;
        });
    })->create();
