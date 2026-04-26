package com.example.cartservice.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository repository;

    public List<CartItem> getCart(Long userId) {
        return repository.findByUserId(userId);
    }

    @Transactional
    public CartItem addOrUpdateItem(Long userId, Long productId, int quantity, double priceSnapshot) {
        CartItem item = repository.findByUserIdAndProductId(userId, productId)
                .orElseGet(() -> {
                    CartItem ci = new CartItem();
                    ci.setUserId(userId);
                    ci.setProductId(productId);
                    return ci;
                });
        item.setQuantity(item.getQuantity() + quantity);
        item.setPriceSnapshot(priceSnapshot);
        return repository.save(item);
    }

    @Transactional
    public CartItem updateQuantity(Long userId, Long productId, int quantity) {
        CartItem item = repository.findByUserIdAndProductId(userId, productId)
                .orElseThrow();
        item.setQuantity(quantity);
        return repository.save(item);
    }

    @Transactional
    public void removeItem(Long userId, Long productId) {
        repository.deleteByUserIdAndProductId(userId, productId);
    }
}

