package com.OMEL.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "quatation_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuatationHasItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "purchaseprice")
    private BigDecimal purchaseprice;

    @Basic(optional = true)
    @Column(name = "qty")
    private Integer qty;

    @Basic(optional = true)
    @Column(name = "lastpurchaseprice")
    private BigDecimal lastpurchaseprice;

    @Basic(optional = true)
    @Column(name = "freeqty")
    private Integer freeqty;

    @JoinColumn(name = "quatation_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private Quatation quatation_id;

    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Item item_id;

}
