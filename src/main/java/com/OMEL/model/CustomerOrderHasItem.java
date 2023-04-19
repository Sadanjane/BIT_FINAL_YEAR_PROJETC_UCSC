package com.OMEL.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "customerorder_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOrderHasItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = true)
    @Column(name = "saleprice")
    private BigDecimal saleprice;

    @Basic(optional = true)
    @Column(name = "qty")
    private BigDecimal qty;

    @Basic(optional = true)
    @Column(name = "linetotal")
    private BigDecimal linetotal;

    @JoinColumn(name = "customerorder_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private CustomerOrder customerorder_id;

    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Item item_id;

}
