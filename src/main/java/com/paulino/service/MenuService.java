package com.paulino.service;

import com.paulino.model.Menu;

import java.util.List;

public interface MenuService {
    List<Menu> getMenus();
    Menu create(Menu menu);
}
