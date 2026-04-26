package com.example.cartservice.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    private Long extractUserIdFromHeader(String header) {
        if (header == null || header.isBlank()) {
            throw new RuntimeException("Missing user id header");
        }
        return Long.parseLong(header);
    }

    @GetMapping
    public List<CartItem> getCart(@RequestHeader("X-User-Id") String userIdHeader) {
        Long userId = extractUserIdFromHeader(userIdHeader);
        return cartService.getCart(userId);
    }

    @PostMapping
    public CartItem addToCart(
            @RequestHeader("X-User-Id") String userIdHeader,
            @RequestBody AddToCartRequest request
    ) {
        Long userId = extractUserIdFromHeader(userIdHeader);
        return cartService.addOrUpdateItem(userId, request.productId(), request.quantity(), request.price());
    }

    @PutMapping("/{productId}")
    public CartItem updateQuantity(
            @RequestHeader("X-User-Id") String userIdHeader,
            @PathVariable Long productId,
            @RequestBody UpdateQuantityRequest request
    ) {
        Long userId = extractUserIdFromHeader(userIdHeader);
        return cartService.updateQuantity(userId, productId, request.quantity());
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeItem(
            @RequestHeader("X-User-Id") String userIdHeader,
            @PathVariable Long productId
    ) {
        Long userId = extractUserIdFromHeader(userIdHeader);
        cartService.removeItem(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Removed"));
    }

    public record AddToCartRequest(Long productId, int quantity, double price) {}
    public record UpdateQuantityRequest(int quantity) {}
}

