package com.OMEL.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "item")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "itemcode")
    private String itemcode;

    @Basic(optional = false)
    @Column(name = "itemname")
    private String itemname;

    @Basic(optional = true)
    @Column(name = "rop")
    private Integer rop;

    @Basic(optional = true)
    @Column(name = "roq")
    private Integer roq;

    @Basic(optional = true)
    @Column(name = "maxqty")
    private Integer maxqty;

    @Basic(optional = true)
    @Column(name = "description")
    private String description;

    @Basic(optional = true)
    @Column(name = "photo")
    private byte[] photo;

    @Basic(optional = false)
    @Column(name = "addeddate")
    private LocalDate addeddate;

    @JoinColumn(name = "itemstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private ItemStatus itemstatus_id;

    @JoinColumn(name = "subcategory_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private SubCategory subcategory_id;

    @JoinColumn(name = "brand_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Brand brand_id;

    @JoinColumn(name = "unit_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Unit unit_id;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employee_id;

    public Item(String itemcode){
        this.itemcode = itemcode;
    }

    //Create cunstructor for get Items in supplier form
    public Item(Integer id , String itemcode , String itemname){
        this.id = id;
        this.itemcode = itemcode;
        this.itemname = itemname;
    }

    public Item(Integer id , String itemcode){
        this.id = id;
        this.itemcode = itemcode;
    }
}
