-- CreateIndex
CREATE INDEX "Menu_businessId_idx" ON "Menu"("businessId");

-- CreateIndex
CREATE INDEX "MenuItem_menuId_order_idx" ON "MenuItem"("menuId", "order");
